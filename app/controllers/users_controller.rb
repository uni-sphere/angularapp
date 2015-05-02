class UsersController < ApplicationController
  
  def login
    if current_organization.users.exists? email: params[:email]
      user = current_organization.users.find_by_email params[:email]
      if user.password == params[:password]
        cookies.signed[:unisphere_api_admin] = user.id
        if cookies.signed[:unisphere_api_admin] == user.id
          render json: {cookie: cookies[:unisphere_api_admin]}.to_json, status: 200
        else
          cookies.delete :unisphere_api_admin
          send_error('problem to write cookies', 500)
        end
      else
        send_error('forbiden', 403)
      end
    else
      send_error('not found', 404)
    end
  end
  
  def update
    user = current_admin
    user.password = params[:password] if params[:password]
    user.name = params[:name] if params[:name]
    user.email = params[:email] if params[:email]
    if user.save
      render json: user, status: 200
    else
      render json: user.errors, status: 422
    end
  end
  
  def invite
    if params[:emails]
      emails = params[:emails]
      emails.each do |email|
        user = current_organization.users.new(email: email)
        psw = random_password
        user.password = psw
        if user.save
          UserMailer.invite_user_email(email, current_organization, psw).deliver
        else
          send_error('user not created', 500)
        end
      end
    else
      send_error('email not received', 400)
    end
  end
  
  def password_forgoten
    if params[:email]
      user = current_organization.users.find_by(email: params[:email])
      UserMailer.password_forgoten_email(user.email, current_organization).deliver
    else
      send_error('email not received', 400)
    end
  end

end