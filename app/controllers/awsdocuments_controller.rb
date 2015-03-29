class AwsdocumentsController < ActionController::Base
	
  # before_action :get_node, only: [:show, :update, :destroy, :create, :unarchive]
#   before_action :get_awsdocument, only: [:show, :update, :destroy, :download, :unarchive, :archives]
  
  def create
    awsdocument = @node.awsdocuments.new(awsdocument_params)
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    render json: @awsdocument, status: 200
  end
  
  def archives
    if @node.awsdocuments.exists?(archived: false)
      @awsdocuments = @node.awsdocuments.where(archived: false)
    else
      render json: {error: 'unauthorized'}.to_json, status: 401
    end
  end
  
  def unarchive
    if @awsdocument.unarchive
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def download
    uploader = DocumentUploader.new
    uploader.retrieve_from_store!('getting_starteds.txt')
    send_file uploader.file.path, :disposition => 'attachment', :url_based_filename => false
  end
  
  def update
    if @awsdocument.update(awsdocument_params)
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
    if @superadmin
      awsdocuments = @oganization.nodes.awsdocuments.where(archived: false)
      render json: awsdocuments, status: 200
    else
      render json: {error: 'unauthorized'}.to_json, status: 401
    end
  end
  
  private
  
  def get_awsdocument
    if Awsdocuments.exists? params[:id]
      @awsdocument = @node.awsdocuments.find_unarchived params[:id]
    else
      render json: {error: "resource not found"}.to_json, status: 404
    end
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:content, :node_id, :archived, :name, :type)
  end
  
end