class OrganizationsController < ApplicationController
  
  def create
    organization = Organization.new(name: params[:name], latitude: params[:latitude], longitude: params[:longitude], place_id: params[:place_id], website: params[:website])
    node = organization.nodes.new(name: params[:name], parent_id: 0)
    if organization.save and node.save # and create_pointer(organization.subdomain)
      render json: { organization: organization, user: user, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
    else
      logger.info organization.errors.inspect
      send_error('Problem occured while organization creation', '500')
      Rollbar.error('Error: organization creation', name: organization.name)
    end
  end
  
  def show
    render json: {name: current_organization.name}.to_json, status: 200
  end
  
  def update
    if current_organization.update(name: params[:name])
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
  
end