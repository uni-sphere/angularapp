class UsersController < ActionController::Base
  
  def password_forgoten
    if params[:email]
      user = @organization.users.find_by(email: params[:email])
      # send email with new token
    else
      send_error('email not received', 400)
    end
  end
  
  def show
    # render json: @user, status: 200
  end
  
  def update
    # if @user.update(user_params)
    #   render json: @user, status: 200
    # else
    #   render json: @user.errors, status: 422
    # end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:access, :access_alias, :email)
  end
  
end