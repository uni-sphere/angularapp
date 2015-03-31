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
    clear_logs(request.headers.inspect)
    send_error('Unauthorized client', 401) unless token == '6632398822f1d84468ebde3c837338fb'
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

      if Organization.exists?(name: params[:subdomain])
        @organization = Organization.find_by(name: params[:subdomain])
      else
        send_error('organization not found', 404)
      end
  end

  def set_admin_cookies(access)
    if @organization.users.exists?(access: access) or @organization.users.exists?(access_alias: access)
      cookies.signed[:unisphere_api_admin] = access
    end
  end
  
  def has_admin_rights?
    send_error('unauthorized', 401) unless is_admin?
  end
  
  def current_admin
    # return admin = @organization.users.find_by(access: ) ? admin : nil
  end
  
  def get_node
    params[:node_id] = params[:id] if request.url.include? 'node'
    if params[:node_id]
      if @organization.nodes.exists? params[:node_id]
        @node = @organization.nodes.find params[:node_id]
      else
        send_error('node not found', 404)
      end
    else
      send_error('node id not received', 400)
    end
  end
  
  def get_chapter
    params[:chapter_id] = params[:id] if request.url.include? 'chapter'
    if params[:chapter_id]
      if @node.chapters.exists? params[:chapter_id]
        @chapter = @node.chapters.find params[:chapter_id]
      else
        send_error('chapter not found', 404)
      end
    else
      send_error('chapter id not received', 400)
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





