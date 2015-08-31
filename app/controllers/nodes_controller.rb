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
      if @current_organization.nodes.where(parent_id: parent.id).count == 1
        parent.chapters.where(archived: false).each do |chapter|
          chapter.update(node_id: node.id)
        end
        Action.create(name: 'created', object_id: node.id, object_type: 'node', object: node.name, organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: node, status: 201, location: node
      else
        chapter = node.chapters.new(title: 'main', parent_id: 0, user_id: current_user.id)
        if chapter.save
          Action.create(name: 'created', object_id: node.id, object_type: 'node', object: node.name, organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: node, status: 201, location: node
        else
          Action.create(name: 'created', error: true, object_type: 'node', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: chapter.errors, status: 422
        end
      end
    else
      Action.create(name: 'created', error: true, object_type: 'node', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: {node_error: node.errors, report_error: report.errors}, status: 422
    end
  end

  def update
    if @current_node.update(name: params[:name])
      Action.create(name: 'renamed', object_id: @current_node.id, object_type: 'node', object: @current_node.name, organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: @current_node, status: 200
    else
      Action.create(name: 'renamed', error: true, object_type: 'node', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: @current_node.errors, status: 422
    end
  end

  def destroy
    if @current_node.parent_id != 0 and @current_organization.nodes.where(archived: false).count > 2
      Action.create(name: 'archived', object_id: @current_node.id, object_type: 'node', object: @current_node.name, organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
      parent = Node.where(archived: false).find @current_node.parent_id
      parent.chapters.create(title: 'main', parent_id: 0, user_id: current_user.id) if @current_organization.nodes.where(parent_id: parent.id).count == 1
      deleted = archive_children(@current_node.id)
      @current_node.archive
      render json: {deleted: deleted}.to_json, status: 200
    else
      Action.create(name: 'destroyed', error: true, object_type: 'node', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
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

  def index_for_mobile
    @tree = []
    current_user.nodes.where(archived: false).each do |node|
      @tree << node
      node.chapters.where(archived: false).each do |chapter|
        @tree << chapter
        chapter.awsdocuments.each do |document|
          @tree << document if !document.archived
        end
      end
    end
    render json: tree, status: 200
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
