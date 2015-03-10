class AwsdocumentsController < ActionController::Base
	
  # before_action :get_awsdocument, only: [:show, :update, :destroy]
  
  def create
    @awsdocument = current_user.awsdocuments.new(awsdocument_params)
    respond_with @awsdocument.save ? @awsdocument : @awsdocument.errors
  end
  
  def show
    respond_with @awsdocument.nil? ? {error: true}.to_json : @awsdocument
  end
  
  def update
    respond_with @awsdocument.save ? @awsdocument : @awsdocument.errors
  end
  
  def destroy
    respond_with @awsdocument.nil? ? {error: 'document unknown'}.to_json : @awsdocument.destroy
  end
  
  def index
    @awsdocuments = current_organization.awsdocuments.all
  end
  
  private
  
  def get_awsdocument
    @awsdocument = current_user.awsdocuments.find params[:id]
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:key, :url, :user_id, :node_id)
  end
  
end