class OrganizationsController < ApplicationController
  
  def is_signed_up?
    if current_organization.users.where(email: params[:email]).exists? or current_organization.subdomain == 'sandbox'
      render json: {response: true}.to_json, status: 200
    else
      send_error('You are not signed up', '403')
    end
  end
    
  def create
    organization = Organization.new(name: params[:name], latitude: params[:latitude], longitude: params[:longitude], place_id: params[:place_id], website: params[:website])
    node = organization.nodes.new(name: params[:name], parent_id: 0)
    firstchild = organization.nodes.new(name: 'First Level')
    secondchild = organization.nodes.new(name: 'Second Level')
    if organization.save and node.save and create_pointer(organization.subdomain)
      firstchild.parent_id = node.id
      secondchild.parent_id = node.id
      firstchild.save
      secondchild.save
      render json: { organization: organization, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
    else
      send_error('Problem occured while organization creation', '500')
      Rollbar.error('Error: organization creation', name: organization.name)
    end
  end
  
  def show
    render json: {organization: current_organization}.to_json, status: 200
  end
  
  def update
    if current_organization.update(name: params[:name])
      render json: current_organization, status: 200
    else
      render json: current_organization.errors, status: 422
    end
  end
  
  def destroy
    Organization.find(params[:id]).destroy
    head 204
  end
  
  def index
    organizations = Organization.all
    render json: organizations, status: 200
  end
  
end