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
      render json: current_user, success: 200
    else
      send_error('Unauthorized', 401)
    end
  end
  
  def invite
    if params[:email]
      UserMailer.invite_user_email(params[:email], current_organization, params[:password]).deliver
      Rollbar.info("User invited", email: params[:email], organization: current_organization)
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
  
  def destroy
    User.find(params[:id]).destroy
    head 204
  end

end
