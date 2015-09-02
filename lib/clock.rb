require 'clockwork'

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end

  every(1.day, 'activity reports') {
    `rake activity_reports:send`
  }
  
  every(6.days, 'awsdocuments links') {
    `rake awsdocuments:refresh`
  }

end