module ApplicationHelper
  
  def format_subdomain(subdomain)
    (ActiveSupport::Inflector.transliterate subdomain.delete('_').downcase).gsub(/[^a-z0-9]/i, "")
  end
  
  def show_params
    logger.info params.inspect
  end
  
  def clear_logs(log)
    logger.info "************************************  #{log}  ************************************"
  end
  
  def select_layout
    if Rails.env.production? and request.url == 'www.unisphere.eu' || 'unisphere.eu'
      layout "home"
    else
      layout "main"
    end
  end

  def force_home_layout
    @layout = "home"
  end

  def force_main_layout
     @layout = "main"
  end

  private
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end


  
end
