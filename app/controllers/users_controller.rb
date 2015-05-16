class UsersController < ApplicationController
  
  def invite
    if params[:emails]
      emails = params[:emails]
      emails.each do |email|
        psw = random_password
        if user = User.invite!(email: email, name: email.split('@').first, provider: 'email', organization_id: current_organization.id, skip_invitation: true)
          user.deliver_invitation
          UserMailer.invite_user_email(email: email, name: email.split('@').first, password: psw).deliver
        else
          send_error('user not created', 500) 
        end
      end
      render json: {response: 'success'}, status: 200
    else
      send_error('email not received', 400)
    end
  end

end