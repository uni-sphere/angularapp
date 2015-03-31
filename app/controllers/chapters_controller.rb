class ChaptersController < ApplicationController
  
  # before_action :get_node
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
    @chapter.destroy
    head 204
  end
  
  def index
    @node = @organization.nodes.last
    tree = []
    @node.chapters.each do |chapter|
      tree << {title: chapter.name, id: chapter.id, parent: chapter.parent_id}
      chapter.awsdocuments.each do |document|
        tree << {title: document.name, doc_id: document.id, parent: document.chapter_id, document: true}
      end
    end
    render json: tree, status: 200
  end
  
  private
  
  def chapter_params
    params.require(:chapter).permit(:name, :parent_id)
  end
  
end