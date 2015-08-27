class OrganizationsController < ApplicationController
  
  before_action :current_subdomain, except: [:create, :destroy, :index]
  before_action :current_organization, except: [:create, :destroy, :index]
  
  def is_signed_up?
    if @current_organization.users.where(email: params[:email]).exists?
      render json: {response: true}.to_json, status: 200
    elsif User.where(email: params[:email]).exists?
      user = User.where(email: params[:email]).first
      render json: {response: user.id}.to_json, status: 200
    else
      render json: {response: false}.to_json, status: 200
    end
  end
  
  def create
    user = User.find params[:user_id]
    organization = Organization.new(name: params[:name], latitude: params[:latitude], longitude: params[:longitude], place_id: params[:place_id], website: params[:website])
    organization.nodes.build(name: params[:name], parent_id: 0, user_id: 0)
    organization.organizationsuserslinks.build(user_id: user.id)
    organization.organizationsuserslinks.build(user_id: User.find_by_email('hello@unisphere.eu').id)
    if organization.save  
      node = organization.nodes.first
      firstchild = organization.nodes.create(name: 'First Level', parent_id: node.id, user_id: user.id)
      firstchild.chapters.build(title: 'main', parent_id: 0, user_id: user.id)
      secondchild = organization.nodes.create(name: 'Second Level', parent_id: node.id, user_id: user.id)
      secondchild.chapters.build(title: 'main', parent_id: 0, user_id: user.id)
      if firstchild.save and secondchild.save
        if dev?
          if dev_create_pointer(organization.subdomain)
            Rollbar.info("Organization created", organization: organization.name)
            render json: { organization: organization, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
          else
            firstchild.destroy
            secondchild.destroy
            node.destroy
            organization.destroy
            send_error('Subdomain creation problem', '500')
          end
        else
          if create_pointer(organization.subdomain)
            Rollbar.info("Organization created", organization: organization.name)
            render json: { organization: organization, url: "http://#{organization.subdomain}.unisphere.eu" }.to_json, status: 201, location: organization
          else
            firstchild.destroy
            secondchild.destroy
            node.destroy
            organization.destroy
            send_error('Subdomain creation problem', '500')
          end
        end
      else
        send_error('Problem occured', '500')
      end
    else
      render json: organization.errors, status: 422
      Rollbar.error('Organization creation', name: organization.name)
    end
  end

  def show
    render json: {organization: @current_organization}.to_json, status: 200
  end

  def update
    if @current_organization.update(name: params[:name])
      render json: @current_organization, status: 200
    else
      render json: @current_organization.errors, status: 422
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
