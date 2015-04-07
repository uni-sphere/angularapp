module ApplicationHelper
  
  def format_subdomain(subdomain)
    I18n.transliterate().delete(subdomain).downcase
  end
  
  def show_params
    logger.info params.inspect
  end
  
  def clear_logs(log)
    logger.info "************************************  #{log} ************************************"
  end
  
  private
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end
  
end
