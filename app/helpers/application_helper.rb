module ApplicationHelper
  
  def show_params
    logger.info params.inspect
  end
  
  def clear_logs(log)
    logger.info "************************************  #{log} ************************************"
  end
  
end
