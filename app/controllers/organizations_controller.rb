class OrganizationsController < ApplicationController
	
  # skip_before_action :authenticate_organization, only: :create
  
  def create
    organization = Organization.new(organization_params)
    node = organization.nodes.new(name: params[:name], parent_id: 0)
    if organization.save and node.save
      render json: organization, status: 201, location: organization
    else
      render json: organization.errors, status: 422
    end
  end
  
  def show
    render json: @organization, status: 200
  end
  
  def update
    if @organization.update(organization_params)
      render json: @organization, status: 200
    else
      render json: @organization.errors, status: 422
    end
  end
  
  def destroy
    @organization.destroy
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