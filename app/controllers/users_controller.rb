class UsersController < ActionController::Base
	
  before_action :get_user, only: [:show, :update, :destroy]
	
  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: 201, location: user
    else
      render json: user.errors, status: 422
    end
  end
  
  def show
    render json: @user, status: 200
  end
  
  def update
    if @user.update(user_params)
      render json: @user, status: 200
    else
      render json: @user.errors, status: 422
    end
  end
  
  def destroy
    @user.destroy
    head 204
  end
  
  def index
    users = current_organization.users.all
    render json: users, status: 200
  end
  
  private
  
  def get_user
    if current_organization.users.exists? params[:id]
      @user = current_organization.users.find params[:id]
    else
      render json: {error: "resource not found"}.to_json, status: 404
    end
  end
  
  def user_params
    params.require(:user).permit(:login, :admin)
  end
  
end
