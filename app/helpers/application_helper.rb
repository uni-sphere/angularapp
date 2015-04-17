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
  
  private
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end
  
end
