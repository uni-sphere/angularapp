class UsersController < ApplicationController
  
  def invite
    if params[:emails]
      emails = params[:emails]
      emails.each do |email|
        send_error('user not created', 500) unless User.invite!(email: email, name: email.split('@').first, provider: 'email', organization_id: current_organization.id)
      end
      render json: {response: 'success'}, status: 200
    else
      send_error('email not received', 400)
    end
  end

end