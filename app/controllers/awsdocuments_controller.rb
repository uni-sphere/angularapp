class AwsdocumentsController < ActionController::Base
	
  before_action :get_awsdocument, only: [:show, :update, :destroy]
  
  has_attached_file :content
  
  def create
    awsdocument = current_user.awsdocuments.new(awsdocument_params)
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    render json: @awsdocument, status: 200
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
    awsdocuments = current_organization.awsdocuments.where(archived: false)
    render json: awsdocuments, status: 200
  end
  
  def archive
    awsdocuments = current_organization.awsdocuments.where(archived: true)
    render json: awsdocuments, status: 200
  end
  
  private
  
  def get_awsdocument
    if current_user.awsdocuments.find_unarchived params[:id]
      @awsdocument = current_user.awsdocuments.find params[:id]
    else
      render json: {error: "resource not found"}.to_json, status: 404
    end
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:content, :user_id, :node_id)
  end
  
end