class ApplicationController < ActionController::Base

  before_action :configure_permitted_parameters, if: :devise_controller?

  include DeviseTokenAuth::Concerns::SetUserByToken

  include AuthenticationHelper
  include ApplicationHelper
  include SubdomainHelper
  include SubdomaindevHelper

  rescue_from NoMethodError, with: :send_404
  rescue_from ActiveRecord::RecordNotFound, with: :send_404

  protect_from_forgery with: :null_session
  before_action :authenticate_client

  def new_contact
    Rollbar.info("Contact request", email: params[:email], university: params[:university], message: params[:message])
    head 204
  end
  
  def current_user
    if is_sandbox?
      User.find_by_email 'user@unisphere.eu'
    else
      super
    end
  end

  def authenticate_user!
    if is_sandbox?
      return true
    else
      super
    end
  end
  
  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name
    devise_parameter_sanitizer.for(:sign_up) << :organization_id
    devise_parameter_sanitizer.for(:account_update) << :name
    devise_parameter_sanitizer.for(:account_update) << :help
  end

end
