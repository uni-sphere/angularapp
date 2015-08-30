class AwsdocumentsController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  before_action :track_connexion
  before_action :current_node, only: [:archives, :create]
  before_action :current_chapter, only: [:create]
  before_action :current_awsdocument, except: [:create]

  before_action :is_allowed?, only: [:update, :destroy, :archives]

  def create
    awsdocument = @current_chapter.awsdocuments.new(title: params[:title], content: params[:file], organization_id: @current_organization.id, user_id: current_user.id)
    if awsdocument.save
      Action.create(type: 'created', object_id: @current_chapter.awsdocuments.last.id, object_type: 'document', object: @current_chapter.awsdocuments.last.title)
      render json: awsdocument, status: 201, location: awsdocument
    else
      Action.create(type: 'created', error: true, object_type: 'document')
      render json: awsdocument.errors, status: 422
    end
  end

  def show
    preview_link = @current_awsdocument.content.file.authenticated_url
    render json: preview_link, status: 200
  end

  def archives
    @current_awsdocuments = @current_node.awsdocuments.where(archived: false)
  end

  def unarchive
    if @current_awsdocument.unarchive
      render json: @current_awsdocument, status: 200
    else
      render json: @current_awsdocument.errors, status: 422
    end
  end

  def update
    if @current_awsdocument.update(title: params[:title])
      Action.create(type: 'renamed', object_id: @current_awsdocument.id, object_type: 'document', object: @current_awsdocument.title)
      render json: @current_awsdocument, status: 200
    else
      Action.create(type: 'renamed', error: true, object_type: 'document')
      render json: @current_awsdocument.errors, status: 422
    end
  end

  def destroy
    Action.create(type: 'archived', object_id: @current_awsdocument.id, object_type: 'document', object: @current_awsdocument.title)
    @current_awsdocument.archive
    head 204
  end

  private

  def is_allowed?
    chapter = Chapter.where(archived: false).find @current_awsdocument.chapter_id
    node = Node.where(archived: false).find chapter.node_id
    send_error('Forbidden', '403') unless current_user.awsdocuments.where(archived: false).exists?(@current_awsdocument.id) or current_user.nodes.where(archived: false).exists?(node.id) or current_user.email == 'hello@unisphere.eu'
  end

end
