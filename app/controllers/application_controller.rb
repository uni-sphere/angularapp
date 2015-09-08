class ApplicationController < ActionController::Base
  
  before_action :configure_permitted_parameters, if: :devise_controller?
    
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  include AuthenticationHelper
  include ApplicationHelper
  include SubdomainHelper
  include SubdomaindevHelper
  
  protect_from_forgery with: :null_session
  before_action :authenticate_client
  
  protected
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name
    devise_parameter_sanitizer.for(:sign_up) << :organization_id
    devise_parameter_sanitizer.for(:account_update) << :name
    devise_parameter_sanitizer.for(:account_update) << :help
  end
  
end
