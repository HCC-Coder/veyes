# preview playable elements

## canvas

 - ctrl_show        :focus control tab of this element
 - canvas_in        :btn to activate canvas and action
 - canvas_action    :btn to shorthand action
 - canvas_out       :btn to deactivate canvas and action
 - callback_out     :trigger hook to deactivate canvas and activate next

## video

 - ctrl_show
 - canvas_in        :start_play
 - canvas_action    :stop
 - callback_out     :on_video_ended

## photo_stopper

 - ctrl_show
 - canvas_in        :play
 - canvas_action    :black
 - canvas_out       :next_canvas

## instawall

 - ctrl_show
 - canvas_in        :on_show
 - canvas_action    :hide (still query)
 - canvas_out       :off  (stop query)

## timer

 - ctrl_show
 - canvas_in        :show_start
 - canvas_action    :hide_stop
 - canvas_out       :hide_stop
 - callback_out     :on_coundown_zero

## transition

 - canvas_in        :play
 - callback_out     :on_transition_end

## song-arranged

 - canvas_in        :first_slide
 - canvas_out       :next_canvas
 - callback_out     :on_last_slide_end

## 

