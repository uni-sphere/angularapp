module AuthenticationHelper
  
  private
  
  $TOKEN = '6632398822f1d84468ebde3c837338fb'
  
  def authentication
    authenticate_client unless request.path == '/'
    authenticate_organization(request.path)
  end
  
  def authenticate_client
    authenticate_with_http_token do |token, options|
       send_error('Bad token', 401) unless token == $TOKEN
    end
  end
  
  def authenticate_organization(path)
    if Rails.env.production?
      if path == '/'
        subdomain = request.env['HTTP_HOST'].split('.').first
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        subdomain = uri.split('.').first
      end
      if Organization.exists?(subdomain: subdomain)
        @organization = Organization.find_by(subdomain: subdomain)
      else
        send_error('organization not found', 404)
      end
    else
      @organization = Organization.last
    end
  end
  
  def get_node
    params[:node_id] = params[:id] if request.url.split('?').first.include? 'node'
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
    params[:chapter_id] = params[:id] if request.url.split('?').first.include? 'chapter'
    if params[:chapter_id]
      if @node.chapters.exists? params[:chapter_id]
        @chapter = @node.chapters.find params[:chapter_id]
      elsif params[:chapter_id] == 0
        @chapter = @node.chapters.first
      else
        send_error('chapter not found', 404)
      end
    else
      send_error('chapter id not received', 400)
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





