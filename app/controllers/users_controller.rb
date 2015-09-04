class UsersController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  before_action :track_connexion
  
  def index
    if current_user
      render json: {users: @current_organization.users}.to_json, success: 200
    else
      send_error('Unauthorized', 401)
    end
  end

  def show
    if current_user
      render json: current_user, success: 200
    else
      send_error('Unauthorized', 401)
    end
  end

  def invite
    user = User.new(email: params[:email], name: params[:email], uid: "foo", provider: 'email', password: params[:password], help: false)
    if user.save
      link = Organizationsuserslink.new(user_id: User.find_by_email(params[:email]).id, organization_id: @current_organization.id)
      if link.save
        Rollbar.info("User invited", email: params[:email], organization: @current_organization)
        UserMailer.invite_user_email(current_user, params[:email], @current_organization, params[:password]).deliver
        Action.create(name: 'created', obj_id: @current_organization.users.last.id, object_type: 'user', object: params[:email], organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: {success: true, user: user}.to_json, success: 200
      else
        Action.create(name: 'created', error: true, object_type: 'user', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
        render json: user.errors, status: 422
      end
    else
      Action.create(name: 'created', error: true, object_type: 'user', organization_id: @current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: user.errors, status: 422
    end
  end

  def welcome
    if params[:id]
      UserMailer.welcome_email(params[:id], params[:organization_id]).deliver
      Rollbar.info("User created", user: User.find(params[:id]).email)
      render json: {success: true}.to_json, success: 200
    else
      send_error('email not received', 400)
    end
  end

  def destroy
    User.find(params[:id]).destroy
    head 204
  end

end
