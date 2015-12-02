class NodesController < ApplicationController

  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :can_create?, only: [:create]
  before_action :can_update_or_destroy?, only: [:destroy, :update]

  def create
    node = current_organization.nodes.new(name: params[:name], parent_id: params[:parent_id], user_id: current_user.id)
    parent = current_organization.nodes.where(archived: false).find params[:parent_id]
    report = node.reports.new
    if node.save and report.save
      if current_organization.nodes.where(parent_id: parent.id, archived: false).count == 1
        parent.chapters.where(archived: false).each do |chapter|
          chapter.node_id = node.id
          chapter.user_id = current_user.id
          chapter.save
        end
        parent.update(locked: false) if parent.locked
        Action.create(name: 'created', obj_id: node.id, object_type: 'node', object: node.name, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: node, status: 201, location: node
      else
        chapter = node.chapters.new(title: 'main', parent_id: 0, user_id: current_user.id)
        if chapter.save
          parent.update(locked: false) if parent.locked
          Action.create(name: 'created', obj_id: node.id, object_type: 'node', object: node.name, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: node, status: 201, location: node
        else
          Action.create(name: 'created', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: chapter.errors, status: 422
        end
      end
    else
      Action.create(name: 'created', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: {node_error: node.errors, report_error: report.errors}, status: 422
    end
  end

  def update
    if !params[:lock].nil?
      if params[:lock] === 'true'
        current_node.password = params[:password]
        current_node.locked = true
        if current_node.save!
          Action.create(name: 'secured', obj_id: current_node.id, object_type: 'node', object: '', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: current_node, status: 200
        else
          Action.create(name: 'secured', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          send_error('Forbidden', 403)
        end
      else
        current_node.locked = false
        if current_node.save!
          Action.create(name: 'unsecured', obj_id: current_node.id, object_type: 'node', object: '', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: current_node, status: 200
        else
          Action.create(name: 'unsecured', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
          render json: current_node.errors, status: 422
        end
      end
    elsif params[:name]
      if current_node.update(name: params[:name])
        Action.create(name: 'renamed', obj_id: current_node.id, object_type: 'node', object: current_node.name, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_node, status: 200
      else
        Action.create(name: 'renamed', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_node.errors, status: 422
      end
    elsif params[:parent]
      if Node.where(archived: false, parent_id: current_node.parent_id).count == 1 # if parent becomes leaf, create initial chapter
        parent_node = Node.find(current_node.parent_id)
        parent_node.chapters.create(title: 'main', parent_id: 0, user_id: parent_node.user_id)
      end
      dropped = current_node
      old_parent = dropped.parent_id
      old_pos = dropped.position
      new_parent = params[:parent]
      new_pos = params[:position].to_i + 1
      if Node.where(archived: false).exists?(parent_id: params[:parent]) # not leaf
        if dropped.update(parent_id: params[:parent], position: new_pos)
          nodes_to_up = Node.where(archived: false, parent_id: old_parent).where("position >= ? AND id != ?", old_pos, dropped.id)
          nodes_to_down = Node.where(archived: false, parent_id: new_parent).where("position >= ? AND id != ?", new_pos, dropped.id)
          nodes_to_up.each do |node|
            node.update(position: node.position - 1)
          end
          nodes_to_down.each do |node|
            node.update(position: node.position + 1)
          end
          render json: dropped, status: 200
        else
          render json: dropped.errors, status: 422
        end
      else # leaf
        if Node.find(params[:parent]).chapters.count > 1 # if brothers node, forbidden
          send_error('Forbidden', 403)
        else
          if Node.find(params[:parent]).chapters.first.destroy and dropped.update(parent_id: params[:parent], position: 1)
            nodes_to_up = Node.where(archived: false, parent_id: old_parent).where("position >= ? AND id != ?", old_pos, dropped.id)
            nodes_to_up.each do |node|
              node.update(position: node.position - 1)
            end
            render json: dropped, status: 200
          else
            render json: dropped.errors, status: 422
          end
        end
      end
    else
      send_error('Bad request', 400)
    end
  end

  def destroy
    @node_sons = []
    @chapter_sons = []
    if current_node.parent_id != 0 and current_organization.nodes.where(archived: false).count > 2
      Action.create(name: 'archived', obj_id: current_node.id, object_type: 'node', object: current_node.name, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      parent = current_organization.nodes.where(archived: false).find current_node.parent_id
      if params[:pull] == 'true' and current_organization.nodes.where(archived: false, parent_id: parent.id).count < 2 and parent.user_id == current_user.id
        current_node.chapters.where(archived: false).each do |chapter|
          @chapter_sons << chapter.id
          chapter.update(node_id: parent.id)
        end
        pull_children(current_node.id, parent.id)
        current_node.archive
      else
        current_node.chapters.where(archived: false).each do |chapter|
          chapter.awsdocuments.where(archived: false).each do |document|
            document.archive
          end
          @chapter_sons << chapter.id
          chapter.archive
        end
        archive_children(current_node.id)
        current_node.archive
        if Node.where(archived: false).exists?(parent_id: current_node.parent_id)
          nodes_to_pull = Node.where(archived: false, parent_id: current_node.parent_id).where("position > ?", current_node.position)
          nodes_to_pull.each do |node|
            node.update(position: node.position - 1)
          end
        end
        parent.chapters.create(title: 'main', parent_id: 0, user_id: parent.user_id) if current_organization.nodes.where(parent_id: parent.id, archived: false).count == 0
      end
      render json: {deleted: true, node_sons: @node_sons, chapter_sons: @chapter_sons}.to_json, status: 200
    else
      Action.create(name: 'destroyed', error: true, object_type: 'node', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      send_error('You can not destroy the root of your tree', 400)
    end
  end

  def index
    nodes = []
    current_organization.nodes.where(archived: false).order('position ASC').each do |node|
      node_data = []
      if node.chapters.exists?
        queue = [node.chapters.first]
        while queue != [] do
          chapter = queue.pop
          node_data << chapter
          Awsdocument.where(chapter_id: chapter.id, archived: false).select(:title, :user_id, :chapter_id, :organization_id, :id, :archived, :position).order('position DESC').each do |document|
            node_data << (document) if !document.archived
          end
          Chapter.where(archived: false, parent_id: chapter.id).order('position ASC').each do |chap|
            queue << chap
          end
        end
      end
      nodes << {name: node.name, num: node.id, parent: node.parent_id, user_id: node.user_id, superadmin: node.superadmin, node_data: node_data, locked: node.locked, position: node.position}
    end
    render json: nodes, status: 200
  end

  def index_for_mobile
    @tree = []
    current_user.nodes.where(archived: false).order('position ASC').each do |node|
      @tree << node
      node.chapters.where(archived: false).order('position ASC').each do |chapter|
        @tree << chapter
        chapter.awsdocuments.order('position DESC').each do |document|
          @tree << document if !document.archived
        end
      end
    end
    render json: @tree, status: 200
  end

  private

  def can_create?
    user_id = Node.find(params[:parent_id]).user_id
    if user_id == 0
      parent_owner = User.find(current_organization.nodes.first.user_id)
    else
      parent_owner = User.find(user_id)
    end
    send_error('Forbidden', '403') unless parent_owner.id == current_user.id or parent_owner.superadmin or current_organization.nodes.where(parent_id: parent_owner.id, archived: false).count > 0
  end

  def can_update_or_destroy?
    send_error('Forbidden', '403') unless current_user.superadmin or current_user.id == current_node.user_id
  end

end
