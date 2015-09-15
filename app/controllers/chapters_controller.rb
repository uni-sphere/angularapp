class ChaptersController < ApplicationController

  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :is_allowed?, only: [:update, :destroy]

  def create
    chapter = current_node.chapters.new(title: params[:title], parent_id: params[:parent_id], user_id: current_user.id)
    chapter.parent_id = current_node.chapters.where(archived: false).first.id if chapter.parent_id == 0
    if chapter.save
      Action.create(name: 'created', obj_id: current_node.chapters.last.id, object_type: 'chapter', object: current_node.chapters.last.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: chapter, status: 201, location: chapter
    else
      Action.create(name: 'created', error: true, object_type: 'chapter', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: chapter.errors, status: 422
    end
  end

  def show
    current_chapter = Chapter.find(params[:id])
    tree = []
    queue = [current_chapter]
    while queue != [] do
      chapter = queue.pop
      tree << chapter
      Awsdocument.where(chapter_id: chapter.id, archived: false).reverse_order.select(:title, :user_id, :chapter_id, :organization_id, :id, :archived).each do |document|
        tree << (document) if !document.archived
      end
      Chapter.where(archived: false, parent_id: chapter.id).reverse_order.each do |chap|
        queue << chap
      end
    end
    render json: {tree: tree, locked: Node.find(current_chapter.node_id).locked, node_id: current_chapter.node_id, name: Node.find(current_chapter.node_id).name}.to_json, status: 200
  end

  def update
    if current_chapter.update(title: params[:title])
      Action.create(name: 'renamed', obj_id: current_chapter.id, object_type: 'chapter', object: current_chapter.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: current_chapter, status: 200
    else
      Action.create(name: 'renamed', error: true, object_type: 'chapter', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: current_chapter.errors, status: 422
    end
  end

  def destroy
    Action.create(name: 'destroyed', obj_id: current_chapter.id, object_type: 'chapter', object: current_chapter.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
    destroy_with_children(current_chapter.id)
    head 204
  end

  def index
    tree = []
    current_node.chapters.where(archived: false).each do |chapter|
      tree << chapter
      Awsdocument.where(chapter_id: chapter.id, archived: false).select(:title, :user_id, :chapter_id, :organization_id, :id, :archived).each do |document|
        tree << (document) if !document.archived
      end
    end
    render json: {tree: tree, locked: current_node.locked}.to_json, status: 200
  end

  def restrain_link
    if is_localhost?
      start_url = 'localhost:3000'
    else
      start_url = "http://#{current_subdomain}.unisphere.eu"
    end

    if params[:id] == 0
      id = Node.find(params[:node_id]).chapters.first.id
      render json: {link: "#{start_url}/view/chapters/#{id}"}.to_json, status: 200
    else
      render json: {link: "#{start_url}/view/chapters/#{current_chapter.id}"}.to_json, status: 200
    end
  end

  private

  def is_allowed?
    send_error('Forbidden', '403') unless current_user.chapters.where(archived: false).exists?(current_chapter.id) or current_user.nodes.where(archived: false).exists?(current_chapter.node_id) or current_user.superadmin
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

