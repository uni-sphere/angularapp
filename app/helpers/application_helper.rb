module ApplicationHelper
  
  def show_params
    logger.info params.inspect
  end
  
  def clear_logs(log)
    logger.info "************************************  #{log}  ************************************"
  end
  
  def select_layout
    if Rails.env.production? and (request.url == 'www.unisphere.eu' || 'unisphere.eu')
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

  def random_password
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
    password = ''
    10.times { password << chars[rand(chars.size)] }
    return password
  end
  
  def forgot_password(email)
    user = User.find_by_email(email)
    psw = random_password
    user.password = psw
    user.save
    return psw
  end
  
  private
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end
  
end
