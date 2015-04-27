class ChaptersController < ApplicationController

  def create
    chapter = current_node.chapters.new(title: params[:title], parent_id: params[:parent_id], user_id: current_admin.id)
    if chapter.save
      render json: chapter, status: 201, location: chapter
    else
      render json: chapter.errors, status: 422
    end
  end

  def show
    render json: current_chapter, status: 200
  end
  
  def update
    if current_chapter.update(title: params[:title])
      render json: current_chapter, status: 200
    else
      render json: current_chapter.errors, status: 422
    end
  end
  
  def destroy
    destroy_with_children(current_chapter.id)
    head 204
  end
  
  def index
    tree = []
    current_node.chapters.each do |chapter|
      tree << chapter
      chapter.awsdocuments.each do |document|
        tree << document if !document.archived
      end
    end
    render json: tree, status: 200
  end
  
  private
  
  def destroy_with_children(id)
    if Chapter.exists?(parent_id: id)
      Chapter.where(parent_id: id).each do |chapter|
        destroy_with_children(chapter.id)
      end
    end
    Chapter.find(id).destroy
  end
  
end

