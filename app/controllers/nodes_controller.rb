class NodesController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  before_action :track_connexion
  before_action :current_node, only: [:update, :destroy, :is_allowed_destroy?, :is_allowed_update?]
  before_action :is_allowed_destroy?, only: [:destroy]
  before_action :is_allowed_update?, only: [:update]

  def create
    node = @current_organization.nodes.new(name: params[:name], parent_id: params[:parent_id], user_id: current_user.id)
    parent = @current_organization.nodes.where(archived: false).find params[:parent_id]
    report = node.reports.new
    if node.save and report.save
      if parent.chapters.where(archived: false).count > 1
        parent.chapters.where(archived: false).each do |chapter|
          chapter.update(node_id: node.id)
        end
        render json: node, status: 201, location: node
      else
        chapter = node.chapters.new(title: 'main', parent_id: 0, user_id: current_user.id)
        if chapter.save
          render json: node, status: 201, location: node
        else
          render json: chapter.errors, status: 422
        end
      end
    else
      render json: {node_error: node.errors, report_error: report.errors}, status: 422
    end
  end

  def update
    if @current_node.update(name: params[:name])
      render json: @current_node, status: 200
    else
      render json: @current_node.errors, status: 422
    end
  end

  def destroy
    if @current_node.parent_id != 0 and @current_organization.nodes.where(archived: false).count > 2
      deleted = destroy_with_children(@current_node.id)
      render json: {deleted: deleted}.to_json, status: 200
    else
      send_error('You can not destroy the root of your tree', 400)
    end
  end

  def index
    nodes = []
    @current_organization.nodes.where(archived: false).each do |node|
      nodes << {name: node.name, num: node.id, parent: node.parent_id}
    end
    render json: nodes, status: 200
  end

  private

  def is_allowed_update?
    send_error('Forbidden', '403') unless current_user.nodes.where(archived: false).exists?(@current_node.id) or current_user.email == 'hello@unisphere.eu'
  end

  def is_allowed_destroy?
    @forbidden = false
    queue = [@current_node]
    while queue != []
      node = queue.pop
      @forbidden = true if node.user_id != current_user.id
      Node.where(parent_id: node.id, archived: false).each do |node|
        queue << node
      end
    end
    send_error('Forbidden', '403') unless @forbidden == false or current_user.email == 'hello@unisphere.eu'
  end

end
