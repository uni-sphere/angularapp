class UsersController < ActionController::Base
	
  before_action :get_user, only: [:show, :update, :destroy]
	
  def create
    @user = current_organization.users.new(user_params)
    respond_with @awsdocument.save ? @awsdocument : @awsdocument.errors
  end
  
  def show
    respond_with @user.nil? ? {error: true}.to_json : @user
  end
  
  def update
    respond_with @user.save ? @awsdocument : @user.errors
  end
  
  def destroy
    respond_with @user.nil? ? {error: 'user unknown'}.to_json : @user.destroy
  end
  
  def index
    @users = current_organization.users.all
  end
  
  private
  
  def get_user
    @user = current_organization.users.find params[:id]
  end
  
  def user_params
    params.require(:user).permit(:login, :admin)
  end
  
end
