class ChaptersController < ApplicationController

  def create
    chapter = current_node.chapters.new(title: params[:title], parent_id: params[:parent_id])
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
    Chapter.where(parent_id: current_chapter.id).each do |chapter|
      chapter.destroy
    end
    current_chapter.destroy
    head 204
  end
  
  def index
    tree = []
    current_node.chapters.each do |chapter|
      tree << {title: chapter.title, id: chapter.id, parent: chapter.parent_id}
      chapter.awsdocuments.each do |document|
        tree << {title: document.title, doc_id: document.id, parent: document.chapter_id, document: true, preview_link: document.content.file.url, type: document.content.file.content_type, size: document.content.file.size} if !document.archived 
      end
    end
    render json: tree, status: 200
  end
  
  private
  
  def chapter_params
    params.require(:chapter).permit(:title, :parent_id)
  end
  
end