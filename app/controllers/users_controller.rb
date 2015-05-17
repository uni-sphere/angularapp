class UsersController < ApplicationController
  
  def invite
    if params[:email]
      UserMailer.invite_user_email(params[:email], current_organization, params[:password]).deliver
      render json: {success: true}.to_json, success: 200
    else
      send_error('emails not received', 400)
    end
  end
  
  def welcome
    if params[:email]
      UserMailer.welcome_email(params[:id], current_organization).deliver
      render json: {success: true}.to_json, success: 200
    else
      send_error('email not received', 400)
    end
  end

end