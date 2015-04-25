class OrganizationsController < ApplicationController
  
  def create
    organization = Organization.new(name: params[:name])
    node = organization.nodes.new(name: params[:name], parent_id: 0)
    user = organization.users.new(email: params[:email])
    user.password = params[:password]
    report = user.reports.new
    if organization.save and node.save and user.save and report.save # and create_pointer(organization.subdomain)
      UserMailer.welcome_email(organization.name, user.email, "http://#{organization.subdomain}.unisphere.eu").deliver
      render json: { organization: organization, user: user, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
    else
      send_error('Problem occured while organization creation', '500')
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