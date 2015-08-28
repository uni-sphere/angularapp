class OrganizationsuserslinksController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  before_action :track_connexion

  def create
    if params[:user_id] and params[:organization_id]
      link = Organizationsuserslink.new(user_id: params[:user_id], organization_id: @current_organization.id)
      if link.save
        render json: {success: true}.to_json, status: 201
      else
        render json: link.errors, status: 422
      end
    else
      send_error('Params not received', '400')
    end
  end
  
end
