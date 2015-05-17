class UsersController < ApplicationController
  
  # def invite
  #   if params[:emails]
  #     emails = params[:emails]
  #     emails.each do |email|
  #       psw = random_password
  #       if user = User.invite!(email: email, name: email.split('@').first, provider: 'email', organization_id: current_organization.id, password: psw, password_confirmation: psw, skip_invitation: true, invitation_sent_at: DateTime.now, invitation_accepted_at: DateTime.now)
  #         UserMailer.invite_user_email(email, current_organization, psw).deliver
  #       else
  #         send_error('user not created', 500)
  #       end
  #     end
  #     render json: {response: 'success'}, status: 200
  #   else
  #     send_error('email not received', 400)
  #   end
  # end
  
  def invite
    if params[:email]
      UserMailer.invite_user_email(params[:email], current_organization, params[:password]).deliver
      render json: {success: true}.to_json, success: 200
    else
      send_error('emails not received', 400)
    end
  end
  
  def reset_password
    if params[:email]
      UserMailer.reset_password_email(email, current_organization, params[:password]).deliver
    else
      send_error('email not received', 400)
    end
  end

end