class AwsdocumentsController < ApplicationController
	
  before_action :get_node, except: [:destroy, :show, :update, :destroy]
  before_action :get_chapter, except: [:destroy, :show, :update, :destroy]
  before_action :get_awsdocument, only: [:archives, :unarchives, :update, :destroy]
  
  def create
    awsdocument = @chapter.awsdocuments.new(title: params[:title], content: params[:file])
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    preview_link = @awsdocument.content.file.authenticated_url
    render json: preview_link, status: 200
  end
  
  def archives
    @awsdocuments = @node.awsdocuments.where(archived: false)
  end
  
  def unarchive
    if @awsdocument.unarchive
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def update
    if @awsdocument.update(title: params[:title])
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def destroy
    @awsdocument.archive
    head 204
  end
  
  def index
    # awsdocuments = @oganization.nodes.awsdocuments.where(archived: false)
#     render json: awsdocuments, status: 200
  end
  
  private
  
  def get_awsdocument
    if Awsdocument.exists? params[:id]
      @awsdocument = Awsdocument.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:content, :chapter_id, :archived, :title)
  end
  
end