class UsersController < ApplicationController
  
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

end