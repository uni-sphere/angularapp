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
      Awsdocument.where(chapter_id: chapter.id, archived: false).order('position ASC').select(:title, :user_id, :chapter_id, :organization_id, :id, :archived, :position).each do |document|
        tree << (document) if !document.archived
      end
      Chapter.where(archived: false, parent_id: chapter.id).order('parent_id ASC, position ASC').each do |chap|
        queue.unshift(chap)
      end
    end
    render json: {tree: tree, locked: Node.find(current_chapter.node_id).locked, node_id: current_chapter.node_id, name: Node.find(current_chapter.node_id).name}.to_json, status: 200
  end

  def update
    if params[:title]
      if current_chapter.update(title: params[:title])
        Action.create(name: 'renamed', obj_id: current_chapter.id, object_type: 'chapter', object: current_chapter.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_chapter, status: 200
      else
        Action.create(name: 'renamed', error: true, object_type: 'chapter', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: current_chapter.errors, status: 422
      end
    else
      dropped = Chapter.find params[:id]
      old_parent = dropped.parent_id
      old_pos = dropped.position
      if params[:parent] == '0'
        new_parent = current_node.chapters.where(archived: false, parent_id: 0).last.id
      else
        new_parent = params[:parent]
      end
      new_pos = params[:position].to_i
      if dropped.update_attributes(position: new_pos, parent_id: new_parent)
        chapters_to_up = Chapter.where(archived: false, parent_id: old_parent).where("position >= ? AND id != ?", old_pos, dropped.id)
        chapters_to_down = Chapter.where(archived: false, parent_id: new_parent).where("position >= ? AND id != ?", new_pos, dropped.id)
        chapters_to_up.each do |chapter|
          chapter.update(position: chapter.position - 1)
        end
        chapters_to_down.each do |chapter|
          chapter.update(position: chapter.position + 1)
        end
        render json: {chapter: params[:position]}, status: 200
      else
        render json: dropped.errors, status: 422
      end
    end
  end

  def destroy
    Action.create(name: 'destroyed', obj_id: current_chapter.id, object_type: 'chapter', object: current_chapter.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
    @tree = []
    destroy_with_children(current_chapter.id)
    if Chapter.where(archived: false).exists?(parent_id: current_chapter.parent_id)
      chapters_to_pull = Chapter.where(archived: false, parent_id: current_chapter.parent_id).where("position > ?", current_chapter.position)
      chapters_to_pull.each do |chapter|
        chapter.update(position: chapter.position - 1)
      end
    end
    render json: {tree: @tree}.to_json, status: 200
  end

  def index
    main = current_node.chapters.where(title: 'main', archived: false).last
    tree = [main]
    current_node.chapters.where(archived: false).order('parent_id ASC, position ASC').each do |chapter|
      tree << chapter if chapter != main
      Awsdocument.where(chapter_id: chapter.id, archived: false).select(:title, :user_id, :chapter_id, :organization_id, :id, :archived, :position).order('position ASC').each do |document|
        tree << (document)
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
    @tree << id
    Chapter.where(archived: false).find(id).archive
  end

end

