module AuthenticationHelper
  
  private
  
  $TOKEN = '6632398822f1d84468ebde3c837338fb'
  
  def authentication
    # authenticate_client unless request.path == '/'
  end
  
  def authenticate_client
    # authenticate_with_http_token do |token, options|
    #   send_error('Bad token', 401) unless token == $TOKEN
    # end
  end
  
  def current_subdomain
    if Rails.env.production?
      if request == 'unisphere.eu' || 'www.unisphere.eu' || 'sandbox.unisphere.eu' || 'home.unisphere.eu'
        return 'sandbox'
      elsif request.path == '/'
        return request.env['HTTP_HOST'].split('.').first
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        return uri.split('.').first
      end
    else
      return 'sandbox'
    end
  end
  
  def current_organization
    if Rails.env.production?
      subdomain = current_subdomain
      if Organization.exists?(subdomain: subdomain)
        organization = Organization.find_by(subdomain: subdomain)
        return organization
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
  
  def user_nodes
    if Chapter.exists?(user_id: User.first.id)
      chapters = Chapter.where(user_id: User.first.id)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id #if Chapter.where(node_id: chapter.node_id).count > 1 || chapter.awsdocuments.count > 0
      end
      if Node.exists?(id: ids)
        return Node.where(id: ids)
      else
        return {}
      end
    else
      return {}
    end
  end

  def current_chapter
    params[:chapter_id] = params[:id] if request.url.split('?').first.include? 'chapter'
    if params[:chapter_id]
      if current_node.chapters.exists? params[:chapter_id]
        return current_node.chapters.find params[:chapter_id]
      elsif params[:chapter_id] == '0'
        clear_logs current_node.chapters.first
        return current_node.chapters.first
      else
        send_error('chapter not found', 404)
      end
    else
      send_error('chapter id not received', 400)
    end
  end

end  





