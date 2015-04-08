class AwsdocumentsController < ApplicationController
	
  before_action :get_node, except: [:destroy, :show]
  before_action :get_chapter, except: [:destroy, :show]
  # before_action :get_awsdocument, only: [:update, :download, :unarchive, :archives]

  def create
    awsdocument = @chapter.awsdocuments.new(title: params[:title], content: params[:file])
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    awsdocument = Awsdocument.find_unarchived params[:id]
    preview_link = awsdocument.content.file.authenticated_url
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
    if @awsdocument.update(awsdocument_params)
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def destroy
    Awsdocument.find(params[:id]).archive
    head 204
  end
  
  def index
    # awsdocuments = @oganization.nodes.awsdocuments.where(archived: false)
#     render json: awsdocuments, status: 200
  end
  
  private
  
  def get_awsdocument
    if Awsdocuments.exists? params[:id]
      @awsdocument = @node.awsdocuments.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:content, :chapter_id, :archived, :title)
  end
  
end