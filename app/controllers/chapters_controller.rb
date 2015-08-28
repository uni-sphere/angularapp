class ChaptersController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  before_action :track_connexion
  before_action :current_node, only: [:create, :index, :show, :update, :destroy, :is_allowed?]
  before_action :current_chapter, only: [:show, :update, :destroy, :is_allowed?]
  before_action :is_allowed?, only: [:update, :destroy]

  def create
    chapter = @current_node.chapters.new(title: params[:title], parent_id: params[:parent_id], user_id: current_user.id)
    chapter.parent_id = @current_node.chapters.where(archived: false).first.id if chapter.parent_id == 0
    if chapter.save
      render json: chapter, status: 201, location: chapter
    else
      render json: chapter.errors, status: 422
    end
  end

  def show
    render json: @current_chapter, status: 200
  end

  def update
    if @current_chapter.update(title: params[:title])
      render json: @current_chapter, status: 200
    else
      render json: @current_chapter.errors, status: 422
    end
  end

  def destroy
    destroy_with_children(@current_chapter.id)
    head 204
  end

  def index
    tree = []
    @current_node.chapters.where(archived: false).each do |chapter|
      tree << chapter
      chapter.awsdocuments.each do |document|
        tree << document if !document.archived
      end
    end
    render json: tree, status: 200
  end

  private

  def is_allowed?
    send_error('Forbidden', '403') unless current_user.chapters.where(archived: false).exists?(@current_chapter.id) or current_user.nodes.where(archived: false).exists?(@current_chapter.node_id) or current_user.email == 'hello@unisphere.eu'
  end

  def destroy_with_children(id)
    if Chapter.where(archived: false).exists?(parent_id: id)
      Chapter.where(parent_id: id, archived: false).each do |chapter|
        destroy_with_children(chapter.id)
      end
    end
    Chapter.where(archived: false).find(id).archive
  end

end

