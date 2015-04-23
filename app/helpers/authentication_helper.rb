module AuthenticationHelper
  
  private
  
  $TOKEN = '6632398822f1d84468ebde3c837338fb'
  
  def authentication
    authenticate_client unless request.path == '/'
  end
  
  def sandbox?(subdomain)
    return true if subdomain == 'sandbox' and !Rails.env.production?
  end
  
  def authenticate_client
    authenticate_with_http_token do |token, options|
      send_error('Bad token', 401) unless token == $TOKEN
    end
  end
  
  def current_organization
    if Rails.env.production?
      if request.path == '/'
        subdomain = request.env['HTTP_HOST'].split('.').first
        @root = true
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        subdomain = uri.split('.').first
      end
      if Organization.exists?(subdomain: subdomain)
        if sandbox? subdomain
          send_error('sandbox', 403)
        else
          organization = Organization.find_by(subdomain: subdomain)
          organization.reports.last.increase_views if @root
          return organization
        end
      else
        send_error('organization not found', 404)
      end
    else
      return Organization.first
    end
  end
  
  def current_awsdocument
    if Awsdocument.exists? params[:id]
      @awsdocument = Awsdocument.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end
  
  def current_admin
    if cookies.signed[:unisphere_api_admin]
      id = cookies.signed[:unisphere_api_admin]
      if current_organization.users.exists?(id: id)
        return current_organization.users.find id
      end
    else
      return send_error('not admin', 403)
    end
  end
  
  def current_node
    params[:node_id] = params[:id] if request.url.split('?').first.include? 'node'
    if params[:node_id]
      if current_organization.nodes.exists? params[:node_id]
        return current_organization.nodes.find params[:node_id]
      else
        send_error('node not found', 404)
      end
    else
      send_error('node id not received', 400)
    end
  end
  
  def current_chapter
    params[:chapter_id] = params[:id] if request.url.split('?').first.include? 'chapter'
    if params[:chapter_id]
      if current_node.chapters.exists? params[:chapter_id]
        return current_node.chapters.find params[:chapter_id]
      elsif params[:chapter_id] == 0
        return current_node.chapters.first
      else
        send_error('chapter not found', 404)
      end
    else
      send_error('chapter id not received', 400)
    end
  end
  
  def is_admin?
    if cookies.signed[:unisphere_api_admin]
      send_error('unauthorized', 401) if current_organization.users.exists?(["access = :access or access_alias = :access_alias", { access: cookies.signed[:unisphere_api_admin], access_alias: cookies.signed[:unisphere_api_admin] }]).first
    end
  end
  
end  





