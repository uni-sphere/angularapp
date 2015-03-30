module AuthenticationHelper
  
  private
  
  def authentication
    
    @organization = Organization.first
    
    # authenticate_client
    # authenticate_organization
  end
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end
  
  def authenticate_client
    if params[:client_token]
      send_error('client_token not correct', 401) if params[:client_token] != '6632398822f1d84468ebde3c837338fb'
    else
      logger.info params.inspect
      send_error('client_token not received', 400)
    end
  end
  
  def authenticate_organization
    # if params[:organization_token]
#       if Organization.exists?(token: params[:organization_token])
#         @organization = Organization.find_by?(token: params[:organization_token])
#       else
#         send_error('unauthorized', 401)
#       end
#     else
#       send_error('organization_token not received', 400)
#     end

    if subdomain
      @organization = Organization.find_by?(name: subdomain)
    else
      send_error('organization not recognized', 400)
    end
  end

  def set_admin_cookies(access)
    if @organization.users.exists?(access: access) or @organization.users.exists?(access_alias: access)
      cookies.signed[:unisphere_api_admin] = access
    end
  end
  
  def is_admin?
    return true if @organization.users.find_by(access: cookies.signed[:unisphere_api_admin])
  end
  
  def has_admin_rights?
    send_error('unauthorized', 401) unless is_admin?
  end
  
  def current_admin
    # return admin = @organization.users.find_by(access: ) ? admin : nil
  end
  
  def nodes_search(id)
    @nodes.each do |node|
      return node if node.id == id
    end
    return nil
  end
  
  def nodes_exists?(id)
    response = nil
    @nodes.each do |node|
      response = true if node.id == id
    end
    return response
  end
  
  def get_node(id)
    if id
      if nodes_exists?(id)
        @node = nodes_search(id)
      else
        send_error('resource not found', 404)
      end
    else
      send_error('id not received', 400)
    end
  end
  
  
  
end  
  
  
  
  # def datas?
#     if params[:datas]
#       set_datas
#     else
#       send_error('datas not received', 400)
#     end
#   end
#
#   def set_datas
#     # delete cookies
#     cookies.delete :unisphere_api_admin if cookies.signed[:unisphere_api_admin]
#     cookies.delete :unisphere_api_nodes if cookies.signed[:unisphere_api_nodes]
#
#     # set cookies
#     cookies.signed[:unisphere_api_super_admin] = "true" if params[:datas][:superadmin] == true
#     cookies.signed[:unisphere_api_admin] = "true" if params[:datas][:admin] == true or params[:datas][:superadmin] == true
#     cookies.signed[:unisphere_api_nodes] = params[:datas][:classes] if params[:datas][:classes]
#   end
#
#   def read_datas
#     @superadmin == true if cookies.signed[:unisphere_api_super_admin] == "true"
#     is_admin? == true if cookies.signed[:unisphere_api_admin] == "true"
#
#     if @superadmin
#       @node = @organization.nodes.all
#     elsif @organization
#       @nodes = []
#       cookies.signed[:unisphere_api_nodes].each do |hash|
#         parent_id = 100
#         hash.each do |name|
#           if @super_admin
#             node = @organization.nodes.all
#           else
#             node = @organization.nodes.find_or_create_by_name_and_parent_id(name, parent_id)
#           end
#           @nodes << node
#           parent_id = node.id
#         end
#       end
#     else
#       send_error('incorrect json sent', 400)
#     end
#   end





