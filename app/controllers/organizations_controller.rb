class OrganizationsController < ApplicationController
  
  skip_before_action :authenticate_organization, only: :create
  
  def create
    organization = Organization.new(name: params[:name])
    organization.subdomain = format_subdomain organization.name
    node = organization.nodes.new(name: params[:name], parent_id: 0)
    user = organization.users.new(access_alias: params[:password], email: params[:email])
    logger.info organization.inspect
    if organization.save and node.save and user.save# and create_pointer(organization.subdomain)
      UserMailer.welcome_email(user.access_alias, organization.name, user.email, "http://#{organization.subdomain}.unisphere.eu").deliver
      render json: { organization: organization, user: user, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
    else
      logger.info user.errors
      send_error('Problem occured while organization creation', '500')
    end
  end
  
  def show
    render json: current_organization, status: 200
  end
  
  def update
    if current_organization.update(organization_params)
      render json: current_organization, status: 200
    else
      render json: current_organization.errors, status: 422
    end
  end
  
  def destroy
    current_organization.destroy
    head 204
  end
  
  def index
    organizations = Organization.all
    render json: organizations, status: 200
  end
  
  private
  
  def organization_params
    params.require(:organization).permit(:name)
  end
  
end