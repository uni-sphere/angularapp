class ApplicationController < ActionController::Base
  
  before_action :configure_permitted_parameters
  
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  include AuthenticationHelper
  include ApplicationHelper
  include SubdomainHelper
  
  protect_from_forgery with: :null_session
  before_action :authentication
  
  protected
  
  def configure_permitted_parameters
    clear_logs 'YES'
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit({ roles: [] }, :name, :organization_id ) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit({ roles: [] }, :name ) }
  end
  
end
