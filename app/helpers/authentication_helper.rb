module AuthenticationHelper
  
  private
  
  def authenticate_client
    if params[:client_token]
      render json: {error: 'client_token not correct'}.to_json, status: 401 if params[:client_token] != '6632398822f1d84468ebde3c837338fb'
    else
      render json: {error: 'client_token not received'}.to_json, status: 400
    end
  end
  
  def authenticate_organization
    if params[:organization_token]
      if Organization.exists?(token: params[:organization_token])
        @organization = Organization.find_by?(token: params[:organization_token])
      else
        render json: {error: 'unauthorized'}.to_json, status: 401
      end
    else
      render json: {error: 'organization_token not received'}.to_json, status: 400
    end
  end
  
  def datas?
    if params[:datas]
      set_datas
    else
      render json: {error: "datas not received"}.to_json, status: 400
    end
  end
  
  def set_datas
    # delete cookies
    cookies.delete :unisphere_api_admin if cookies.signed[:unisphere_api_admin]
    cookies.delete :unisphere_api_nodes if cookies.signed[:unisphere_api_nodes]
      
    # set cookies
    cookies.signed[:unisphere_api_super_admin] == "true" if params[:datas][:superadmin] == true
    cookies.signed[:unisphere_api_admin] == "true" if params[:datas][:admin] == true or params[:datas][:superadmin] == true
    cookies.signed[:unisphere_api_nodes] = params[:datas][:classes] if params[:datas][:classes]
  end
  
  def read_datas
    @superadmin == true if cookies.signed[:unisphere_api_super_admin] == "true"
    @admin == true if cookies.signed[:unisphere_api_admin] == "true"
    
    if @organization.classes
      @nodes = []
      cookies.signed[:unisphere_api_nodes].each do |hash|
        parent_id = 100
        hash.each do |name|
          if @super_admin
            node = @organization.nodes.all
          else
            node = @organization.nodes.find_or_create_by_name_and_parent_id(name, parent_id)
          end
          @nodes << node
          parent_id = node.id
        end
      end
    elsif @superadmin
      @node = @organization.nodes.all
    else
      render json: {error: 'incorrect json sent'}.to_json, status: 400
    end
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
  
  def get_node
    if id
      if nodes_exists?(params[:node_id])
        @node = nodes_search(params[:node_id])
      else
        render json: {error: "resource not found"}.to_json, status: 404
      end
    else
      render json: {error: "id not received"}.to_json, status: 400
    end
  end
  
  def admin_rights?
    render json: {error: 'unauthorized'}.to_json, status: 401 unless @admin
  end
  
  def superadmin_rights?
    render json: {error: 'unauthorized'}.to_json, status: 401 unless @superadmin
  end
  
end





