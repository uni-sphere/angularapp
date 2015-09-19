require 'clockwork'

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end

  every(7.day, 'activity reports') {
    `rake activity_reports:send`
  }
  
  every(1.day, 'reset sandbox') {
    `rake sandbox:reset`
  }

end