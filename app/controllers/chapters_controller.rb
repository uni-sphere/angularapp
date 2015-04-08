class ChaptersController < ApplicationController
  
  before_action :get_node
  before_action :get_chapter, only: [:show, :update, :destroy]
	
  def create
    chapter = @node.chapters.new(chapter_params)
    if chapter.save
      render json: chapter, status: 201, location: chapter
    else
      render json: chapter.errors, status: 422
    end
  end
  
  def show
    render json: @chapter, status: 200
  end
  
  def update
    if @chapter.update(name: params[:name])
      render json: @chapter, status: 200
    else
      render json: @chapter.errors, status: 422
    end
  end
  
  def destroy
    Chapter.where(parent_id: @chapter.id).each do |chapter|
      chapter.destroy
    end
    @chapter.destroy
    head 204
  end
  
  def index
    tree = []
    @node.chapters.each do |chapter|
      tree << {title: chapter.title, id: chapter.id, parent: chapter.parent_id}
      chapter.awsdocuments.each do |document|
        tree << {title: document.title, doc_id: document.id, parent: document.chapter_id, document: true, preview_link: document.content.file.authenticated_url, type: document.content.file.content_type, size: document.content.file.size} if !document.archived 
      end
    end
    render json: tree, status: 200
  end
  
  private
  
  def chapter_params
    params.require(:chapter).permit(:title, :parent_id)
  end
  
end