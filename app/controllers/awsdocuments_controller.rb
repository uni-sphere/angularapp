class AwsdocumentsController < ApplicationController

  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :is_allowed?, only: [:update, :destroy, :archives]

  def create
    awsdocument = current_chapter.awsdocuments.new(title: params[:title], content: params[:file], organization_id: current_organization.id, user_id: current_user.id)
    if awsdocument.save
      Action.create(name: 'created', obj_id: current_chapter.awsdocuments.last.id, object_type: 'document', object: current_chapter.awsdocuments.last.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: awsdocument, status: 201, location: awsdocument
    else
      Action.create(name: 'created', error: true, object_type: 'document', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: awsdocument.errors, status: 422
    end
  end

  def show
    if !params[:node_id].nil?
      current_node.reports.last.increase_downloads if !is_sandbox?
      if current_node.locked
        if current_node.password == params[:password]
          render json: current_awsdocument.content.file.authenticated_url.to_json, status: 200
        else
          send_error('Forbidden', '403')
        end
      else
        render json: current_awsdocument.content.file.authenticated_url.to_json, status: 200
      end
    else
      node = Node.find(Chapter.find(Awsdocument.where(id: params[:id], archived: false).first.chapter_id).node_id)
      render json: {document: Awsdocument.where(id: params[:id], archived: false).select(:title, :user_id, :chapter_id, :organization_id, :id, :archived), node_id: node.id, locked: node.locked}.to_json, status: 200
    end
  end

  def archives
    current_awsdocuments = current_node.awsdocuments.where(archived: false)
  end

  def unarchive
    if current_awsdocument.unarchive
      render json: current_awsdocument, status: 200
    else
      render json: current_awsdocument.errors, status: 422
    end
  end

  def update
    if params[:title]
      if current_awsdocument.update(title: params[:title])
        Action.create(name: 'renamed', obj_id: current_awsdocument.id, object_type: 'document', object: current_awsdocument.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_awsdocument, status: 200
      else
        Action.create(name: 'renamed', error: true, object_type: 'document', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_awsdocument.errors, status: 422
      end
    else 
      dropped = Awsdocument.find params[:id]
      old_parent = dropped.chapter_id
      old_pos = dropped.position
      if params[:parent] == '0'
        new_parent = current_node.chapters.where(archived: false, parent_id: 0).last.id
      else
        new_parent = params[:parent]
      end
      new_pos = params[:position].to_i
      if dropped.update_attributes(position: new_pos, chapter_id: new_parent)
        docs_to_up = Awsdocument.where(archived: false, chapter_id: old_parent).where("position >= ? AND id != ?", old_pos, dropped.id)
        docs_to_down = Awsdocument.where(archived: false, chapter_id: new_parent).where("position >= ? AND id != ?", new_pos, dropped.id)
        docs_to_up.each do |doc|
          doc.update(position: doc.position - 1)
        end
        docs_to_down.each do |doc|
          doc.update(position: doc.position + 1)
        end
        render json: {document: Awsdocument.find params[:id]}, status: 200
      else
        render json: dropped.errors, status: 422
      end
    end
  end

  def destroy
    Action.create(name: 'archived', obj_id: current_awsdocument.id, object_type: 'document', object: current_awsdocument.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
    current_awsdocument.archive
    head 204
  end
  
  def restrain_link
    if is_localhost?
      start_url = 'localhost:3000'
    else
      start_url = "http://#{current_subdomain}.unisphere.eu"
    end
    render json: {link: "#{start_url}/view/documents/#{current_awsdocument.id}"}.to_json, status: 200
  end
  
  private

  def is_allowed?
    chapter = Chapter.where(archived: false).find current_awsdocument.chapter_id
    node = Node.where(archived: false).find chapter.node_id
    send_error('Forbidden', '403') unless current_user.awsdocuments.where(archived: false).exists?(current_awsdocument.id) or current_user.nodes.where(archived: false).exists?(node.id) or current_user.superadmin
  end

end
