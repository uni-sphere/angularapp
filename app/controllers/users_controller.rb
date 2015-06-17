class UsersController < ApplicationController
  
  def index
    if current_user
      render json: {users: current_organization.users}.to_json, success: 200
    else
      send_error('Unauthorized', 401)
    end
  end
  
  def show
    if current_user
      render json: {user: {name: current_user.name, email: current_user.email}}.to_json, success: 200
    else
      send_error('Unauthorized', 401)
    end
  end
  
  def invite
    if params[:email]
      UserMailer.invite_user_email(params[:email], current_organization, params[:password]).deliver
      render json: {success: true}.to_json, success: 200
    else
      send_error('emails not received', 400)
    end
  end

  def welcome
    if params[:id]
      UserMailer.welcome_email(params[:id], params[:organization_id]).deliver
      Rollbar.info("User created", user: User.find(params[:id]).email)
      render json: {success: true}.to_json, success: 200
    else
      send_error('email not received', 400)
    end
  end

end
