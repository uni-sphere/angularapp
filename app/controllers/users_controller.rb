class UsersController < ApplicationController

  def create
    
  end
  
  def update
    if @user.update(user_params)
      render json: @user, status: 200
    else
      render json: @user.errors, status: 422
    end
  end
  
  def password_forgoten
    if params[:email]
      user = current_organization.users.find_by(email: params[:email])
      # send email with new token
    else
      send_error('email not received', 400)
    end
  end
  
  # def set_admin_cookies(access)
  #   if current_organization.users.exists?(access: access) or current_organization.users.exists?(access_alias: access)
  #     cookies.signed[:unisphere_api_admin] = access
  #   end
  # end
  
  private
  
  def user_params
    params.require(:user).permit(:access, :access_alias, :email)
  end
  
end